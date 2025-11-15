package system.registradora.service;

import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import system.registradora.domain.*;
import system.registradora.domain.usuario.Usuario;
import system.registradora.domain.usuario.UsuarioRepository;
import system.registradora.dto.*;
import system.registradora.infra.security.AuthUtils;
import system.registradora.repositories.*;

import java.time.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Service
public class VentaService {

    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private DetalleVentaRepository detalleVentaRepository;

    @Autowired
    private MovimientoRepository movimientoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private DetalleCompraRepository detalleCompraRepository;

    public Double obtenerUltimoPrecioCompra(Producto producto) {
        if (producto == null || producto.getId() == null) {
            return null;
        }

        Double precioCompra = detalleCompraRepository.obtenerUltimoPrecioCompra(producto.getId());
        return (precioCompra != null && precioCompra > 0) ? precioCompra : null;
    }

    @Transactional
    public VentaDto registrarVenta(VentaDto ventaDto) {
        // 1️⃣ Crear la venta sin detalles y guardarla
        Venta venta = new Venta();
        venta.setDescuento(ventaDto.descuento());
        venta.setFormaDePago(ventaDto.formaDePago());

        if (ventaDto.clienteId() != null) {
            Cliente cliente = clienteRepository.findById(ventaDto.clienteId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cliente no encontrado"));
            venta.setCliente(cliente);
        } else {
            venta.setCliente(null);
        }

        String login = AuthUtils.getLoginFromToken();
        Usuario usuario = usuarioRepository.findUsuarioByLogin(login);

        if (usuario == null || usuario.getEmpleado() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario sin empleado asignado");
        }

        venta.setEmpleado(usuario.getEmpleado());

        // ✅ Guardar antes de usar en DetalleVenta
        venta = ventaRepository.save(venta);

        // 2️⃣ Crear los detalles de la venta y calcular totalVenta
        List<DetalleVenta> detalles = new ArrayList<>();
        AtomicReference<Double> totalVenta = new AtomicReference<>(0.0);

        for (DetalleVentaDto detalleDto : ventaDto.detalles()) {
            Producto producto = productoRepository.findByNombreProducto(detalleDto.nombreProducto())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Producto no encontrado: " + detalleDto.nombreProducto()));

            // 🛠 Si el precio en la BD es 0, tomar el precio desde el frontend (detalleDto.precioUnitario)
            Double precioUnitario = producto.getPrecioVenta();
            if (precioUnitario == 0) {
                if (detalleDto.precioUnitario() == null || detalleDto.precioUnitario() <= 0) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debe ingresar un precio válido para el producto: " + detalleDto.nombreProducto());
                }
                precioUnitario = detalleDto.precioUnitario();
            }

            if (!(producto.getId() == 12 || producto.getId() == 13)) {
                if (producto.getStock() < detalleDto.cantidad()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Stock insuficiente para el producto: " + producto.getNombreProducto());
                }
            }

            double subtotal = precioUnitario * detalleDto.cantidad(); // ✅ Calcular subtotal
            totalVenta.updateAndGet(v -> v + subtotal); // ✅ Actualizar total de forma segura

            // ✅ Crear DetalleVenta correctamente asociado a la Venta
            DetalleVenta detalleVenta = new DetalleVenta();
            detalleVenta.setVenta(venta);
            detalleVenta.setProducto(producto);
            detalleVenta.setCantidad(detalleDto.cantidad());
            detalleVenta.setPrecioUnitario(precioUnitario);

            // Asignar precioCompra si existe la columna
            detalleVenta.setPrecioCompra(obtenerUltimoPrecioCompra(producto));
            System.out.println("validación iteración productos" + producto);

            if (producto.getId() != 12 && producto.getId() != 13) {
                producto.setStock(producto.getStock() - detalleDto.cantidad());
                productoRepository.save(producto);
            }
            detalles.add(detalleVenta);
        }
        detalleVentaRepository.saveAll(detalles);

        // Registrar movimiento de salida
        for (DetalleVenta detalle : detalles) {
            Movimiento movimiento = new Movimiento();
            movimiento.setCantidad(detalle.getCantidad());
            movimiento.setTipoMovimiento(TipoMovimiento.Salida);
            movimiento.setFechaMovimiento(new Date());
            movimiento.setDetalleVenta(detalle);
            movimiento.setProducto(detalle.getProducto());
            movimientoRepository.save(movimiento);
        }

        venta.setTotalVenta(totalVenta.get());
        ventaRepository.save(venta);

        // 5️⃣ Crear respuesta DTO
        return new VentaDto(
                venta.getId(),
                venta.getFechaVenta(),
                venta.getTotalVenta(),
                venta.getDescuento(),
                venta.getFormaDePago(),
                venta.getCliente() != null ? venta.getCliente().getId() : null,
                detalles.stream().map(detalle -> new DetalleVentaDto(
                        detalle.getId(),
                        detalle.getProducto().getNombreProducto(),
                        detalle.getCantidad(),
                        detalle.getPrecioUnitario(),
                        detalle.getPrecioCompra()
                )).collect(Collectors.toList())
        );
    }

    public Map<String, Object> listarVentas(Pageable paginacion) {
        Page<VentaDto> ventas = ventaRepository.listarVentas(paginacion).map(venta ->
                new VentaDto(
                        venta.getId(),
                        venta.getFechaVenta(),
                        venta.getTotalVenta(),
                        venta.getDescuento(),
                        venta.getFormaDePago(),
                        venta.getCliente() != null ? venta.getCliente().getId() : null,
                        venta.getDetalles().stream().map(detalle ->
                                new DetalleVentaDto(
                                        detalle.getId(),
                                        detalle.getProducto().getNombreProducto(),
                                        detalle.getCantidad(),
                                        detalle.getPrecioUnitario(),
                                        detalle.getPrecioCompra())
                        ).collect(Collectors.toList())
                ));

        // Construir una estructura JSON más estable
        Map<String, Object> response = new HashMap<>();
        response.put("contenido", ventas.getContent());  // Lista de ventas
        response.put("paginaActual", ventas.getNumber());
        response.put("totalPaginas", ventas.getTotalPages());
        response.put("totalElementos", ventas.getTotalElements());

        return response;
    }

    public Optional<VentaDto> listarVentasId(Long id) {
        return ventaRepository.findById(id)
                .map(venta -> new VentaDto(
                        venta.getId(),
                        venta.getFechaVenta(),
                        venta.getTotalVenta(),
                        venta.getDescuento(),
                        venta.getFormaDePago(),
                        venta.getCliente().getId(),
                        venta.getDetalles().stream().map(detalle ->
                                new DetalleVentaDto(
                                        detalle.getId(),
                                        detalle.getProducto().getNombreProducto(),
                                        detalle.getCantidad(),
                                        detalle.getPrecioUnitario(),
                                        detalle.getPrecioCompra())
                        ).collect(Collectors.toList())
                ));
    }

    public TotalVentasPorDiaDTO obtenerTotalVentasFecha(LocalDate fecha){
        ZoneId zona = ZoneId.of("America/Bogota");

        // Definir el inicio y fin del día
        ZonedDateTime startOfDay = fecha.atStartOfDay(zona);
        ZonedDateTime endOfDay = fecha.plusDays(1).atStartOfDay(zona);

        Date inicioDelDia = Date.from(startOfDay.toInstant());
        Date finDelDia = Date.from(endOfDay.toInstant());

        // Consultar datos desde el repositorio
        List<TotalVentasPorDiaDTO> resultados =
                ventaRepository.obtenerTotalVentasPorFecha(inicioDelDia, finDelDia);

        // Calcular total
        Double total = resultados.stream()
                .mapToDouble(TotalVentasPorDiaDTO::totalVentas)
                .sum();

        // Construir respuesta
            return new TotalVentasPorDiaDTO(Date.from(fecha.atStartOfDay(zona).toInstant()), total);
    }

    public List<ConsultaVentasPorProductoDto> consultaVentasPorProducto(String nombreProducto){
        // 1️⃣ Normalizar el nombre del producto buscado
        String nombreProductoNormalizado = normalizarTexto(nombreProducto);

        // 2️⃣ Obtener la fecha actual en formato Date
        Date fechaActual = new Date();

        // 3️⃣ Consultar todas las ventas
        Page<Venta> todasLasVentas = ventaRepository.listarVentas(PageRequest.of(0, 100));

        // 4️⃣ Filtrar solo las ventas del día actual y por producto
        List<ConsultaVentasPorProductoDto> ventasFiltradas = todasLasVentas.stream()
                .filter(venta -> esMismaFecha(venta.getFechaVenta(), fechaActual)) // Compara las fechas
                .flatMap(venta -> venta.getDetalles().stream()
                        .filter(detalle -> normalizarTexto(detalle.getProducto().getNombreProducto())
                                .contains(nombreProductoNormalizado))
                        .map(detalle -> new ConsultaVentasPorProductoDto(
                                detalle.getProducto().getNombreProducto(),
                                detalle.getCantidad(),
                                detalle.getPrecioUnitario(),
                                detalle.getId(),
                                detalle.getVenta().getFechaVenta()
                        )))
                .collect(Collectors.toList());

        return ventasFiltradas;
    }

    private boolean esMismaFecha(Date fechaVenta, Date fechaActual) {
        LocalDate fechaVentaLD = fechaVenta.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate fechaActualLD = fechaActual.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        return fechaVentaLD.isEqual(fechaActualLD);
    }

    /**
     * Método para normalizar el texto:
     * - Convierte a minúsculas
     * - Elimina espacios al inicio y final
     * - Quita espacios internos
     */
    private String normalizarTexto(String texto) {
        return texto.trim().toLowerCase().replaceAll("\\s+", "");
    }

    public Map<String, Object> filtroVentas(Pageable paginacion, String formaPago,
                                            LocalDate fechaInicio, LocalDate fechaFin) {

        // 🔹 Crear los filtros dinámicos con Criteria API
        Page<Venta> resultados = ventaRepository.findAll((root, query, cb) -> {
            List<Predicate> filtros = new ArrayList<>();

            if (formaPago != null && !formaPago.isEmpty()) {
                filtros.add(cb.equal(root.get("formaDePago"), formaPago));
            }
            if (fechaInicio != null) {
                filtros.add(cb.greaterThanOrEqualTo(root.get("fechaVenta"), fechaInicio.atStartOfDay()));
            }
            if (fechaFin != null) {
                filtros.add(cb.lessThanOrEqualTo(root.get("fechaVenta"), fechaFin.atTime(23, 59, 59)));
            }

            return cb.and(filtros.toArray(new Predicate[0]));
        }, paginacion);

        // 🔹 Convertir las entidades a DTO
        Page<VentaDto> ventasDto = resultados.map(venta ->
                new VentaDto(
                        venta.getId(),
                        venta.getFechaVenta(),
                        venta.getTotalVenta(),
                        venta.getDescuento(),
                        venta.getFormaDePago(),
                        venta.getCliente() != null ? venta.getCliente().getId() : null,
                        venta.getDetalles().stream()
                                .map(detalle -> new DetalleVentaDto(
                                        detalle.getId(),
                                        detalle.getProducto().getNombreProducto(),
                                        detalle.getCantidad(),
                                        detalle.getPrecioUnitario(),
                                        detalle.getPrecioCompra()
                                ))
                                .toList()
                )
        );

        // 🔹 Armar la respuesta final (estructura JSON)
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("contenido", ventasDto.getContent());
        respuesta.put("paginaActual", ventasDto.getNumber());
        respuesta.put("totalElementos", ventasDto.getTotalElements());
        respuesta.put("totalPaginas", ventasDto.getTotalPages());

        return respuesta;
    }

    public List<UtilidadPorPeriodoDto> obtenerUtilidadPorFecha(LocalDate fechaInicio,
                                                               LocalDate fechaFin) {
        ZoneId zona = ZoneId.of("America/Bogota");

        ZonedDateTime startOfDay = fechaInicio.atStartOfDay(zona);
        ZonedDateTime endOfDay = fechaFin.plusDays(1).atStartOfDay(zona);

        Date inicio = Date.from(startOfDay.toInstant());
        Date fin = Date.from(endOfDay.toInstant());

        return ventaRepository.obtenerUtilidadPorFecha(inicio, fin);
    }

    // 🔹 Convierte LocalDate a LocalDateTime al inicio y fin del día
    private LocalDateTime inicioDelDia(LocalDate fecha) {
        return fecha.atStartOfDay();
    }

    private LocalDateTime finDelDia(LocalDate fecha) {
        return fecha.atTime(LocalTime.MAX);
    }

    // 🔹 Calcular utilidad por rango de fechas
    public UtilidadPorPeriodoDto calcularUtilidadPorRango(LocalDate fechaInicio, LocalDate fechaFin) {
        ZoneId zona = ZoneId.of("America/Bogota");

        ZonedDateTime startOfDay = fechaInicio.atStartOfDay(zona);
        ZonedDateTime endOfDay = fechaFin.plusDays(1).atStartOfDay(zona);

        Date inicio = Date.from(startOfDay.toInstant());
        Date fin = Date.from(endOfDay.toInstant());

        // 🔹 Buscar detalles dentro del rango
        List<DetalleVenta> detalles = detalleVentaRepository.findByRangoFechas(inicio, fin);

        // 🔹 Calcular utilidad total
        double totalUtilidad = detalles.stream()
                .mapToDouble(d -> (d.getPrecioUnitario() - d.getPrecioCompra()) * d.getCantidad())
                .sum();

        // 🔹 Devolver DTO con la fecha de inicio y la utilidad total
        return new UtilidadPorPeriodoDto(inicio, totalUtilidad);
    }

    // 🔹 Utilidad diaria
    public UtilidadPorPeriodoDto calcularUtilidadDiaria() {
        LocalDate hoy = LocalDate.now();
        return calcularUtilidadPorRango(hoy, hoy);
    }

    // 🔹 Utilidad semanal
    public UtilidadPorPeriodoDto calcularUtilidadSemanal() {
        LocalDate hoy = LocalDate.now();
        LocalDate inicioSemana = hoy.with(DayOfWeek.MONDAY);
        return calcularUtilidadPorRango(inicioSemana, hoy);
    }

    // 🔹 Utilidad mensual
    public UtilidadPorPeriodoDto calcularUtilidadMensual() {
        LocalDate hoy = LocalDate.now();
        LocalDate inicioMes = hoy.withDayOfMonth(1);
        return calcularUtilidadPorRango(inicioMes, hoy);
    }
}
