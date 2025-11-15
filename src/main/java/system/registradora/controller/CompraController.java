package system.registradora.controller;

import system.registradora.domain.*;
import system.registradora.domain.*;
import system.registradora.domain.usuario.Usuario;
import system.registradora.domain.usuario.UsuarioRepository;
import system.registradora.dto.CompraDto;
import system.registradora.dto.DetalleCompraDto;
import system.registradora.repositories.*;
import system.registradora.repositories.*;
import jakarta.persistence.criteria.Predicate;
import system.registradora.dto.TotalComprasPorDiaDto;
import system.registradora.infra.security.AuthUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/compras")
public class CompraController {

    @Autowired
    private CompraRepository compraRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private DetalleCompraRepository detalleCompraRepository;

    @Autowired
    private MovimientoRepository movimientoRepository;

    @Autowired
    private ProveedorRepository proveedorRepository;

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping
    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN', 'ALMACENISTA')")
    public ResponseEntity<CompraDto> registrarCompra (@RequestBody CompraDto compraDto){
        System.out.println("📦 Datos recibidos para la compra: " + compraDto);
        Compra compra = new Compra();
        compra.setFechaCompra(new Date());
        compra.setNumeroFactura(compraDto.numeroFactura());

        Proveedor proveedor = proveedorRepository.findById(compraDto.proveedorId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Proveedor no encontrado"));
        compra.setProveedor(proveedor);

        String login = AuthUtils.getLoginFromToken();
        Usuario usuario = usuarioRepository.findUsuarioByLogin(login);
        System.out.println("que usuario está logueado?" + login);
        System.out.println("Login: " + login);

        if (usuario == null || usuario.getEmpleado() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario sin empleado asignado");
        }
        Empleado empleado = usuario.getEmpleado();
        compra.setEmpleado(empleado);

        System.out.println("Empleado: " + empleado.getId());
        System.out.println("Proveedor: " + proveedor.getId());
        System.out.println("Compra antes de guardar: " + compra);
        compra = compraRepository.save(compra);

        double totalCompra = 0.0;

        List<DetalleCompra> detalles = new ArrayList<>();
        for (DetalleCompraDto dto : compraDto.detalleCompraDtoList()) {
            Producto producto = productoRepository.findById(dto.productoId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Producto no encontrado"));

            DetalleCompra detalle = new DetalleCompra();
            detalle.setCompra(compra);
            detalle.setProducto(producto);
            detalle.setCantidad(dto.cantidad());
            detalle.setPrecioUnitario(dto.precioUnitario());

            detalleCompraRepository.save(detalle);
            detalles.add(detalle);

            producto.setStock(producto.getStock() + dto.cantidad());
            productoRepository.save(producto);

            //Registrar movimiento de entrada
            Movimiento movimiento = new Movimiento();
            movimiento.setProducto(producto);
            movimiento.setDetalleCompra(detalle);
            movimiento.setCantidad(dto.cantidad());
            movimiento.setTipoMovimiento(TipoMovimiento.Entrada);
            movimiento.setFechaMovimiento(new Date());
            movimientoRepository.save(movimiento);

            totalCompra += dto.cantidad() * dto.precioUnitario();
        }

        compra.setTotalCompra(totalCompra);
        compraRepository.save(compra);

        List<DetalleCompraDto> detallesRespuesta = detalles.stream().map(detalle -> new DetalleCompraDto(
                detalle.getId(),
                detalle.getProducto().getId(),
                detalle.getProducto().getNombreProducto(),
                detalle.getCantidad(),
                detalle.getPrecioUnitario()
        )).toList();

        CompraDto respuesta = new CompraDto(
                compra.getId(),
                compra.getFechaCompra(),
                compra.getTotalCompra(),
                compra.getNumeroFactura(),
                proveedor.getId(),
                detallesRespuesta
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
    }

    @GetMapping("/listarCompras")
    @PreAuthorize("hasAnyRole('ADMIN', 'ALMACENISTA')")
    public ResponseEntity<Map<String, Object>> listarCompras(@PageableDefault(size = 10)Pageable paginacion){
        Page<CompraDto> compras = compraRepository.listarCompras(paginacion).map(compra ->
                new CompraDto(
                        compra.getId(),
                        compra.getFechaCompra(),
                        compra.getTotalCompra(),
                        compra.getNumeroFactura(),
                        compra.getProveedor().getId(),
                        compra.getDetalleCompraList().stream().map(detalle ->
                                new DetalleCompraDto(
                                        detalle.getId(),
                                        detalle.getProducto().getId(),
                                        detalle.getProducto().getNombreProducto(),
                                        detalle.getCantidad(),
                                        detalle.getPrecioUnitario()
                                )).collect(Collectors.toList())
                ));

        Map<String, Object> response = new HashMap<>();
        response.put("contenido", compras.getContent());
        response.put("paginaActual", compras.getNumber());
        response.put("totalPaginas", compras.getTotalPages());
        response.put("totalElementos", compras.getTotalElements());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompraDto> buscarCompraPorId(@PathVariable Long id){
        Optional<Compra> compraConsultada = compraRepository.findById(id);
        if (compraConsultada.isPresent()) {
            Compra compra = compraConsultada.get();
            CompraDto compraDto = new CompraDto(
                    compra.getId(),
                    compra.getFechaCompra(),
                    compra.getTotalCompra(),
                    compra.getNumeroFactura(),
                    compra.getProveedor().getId(),
                    compra.getDetalleCompraList().stream().map(detalleCompra ->
                            new DetalleCompraDto(
                                    detalleCompra.getId(),
                                    detalleCompra.getProducto().getId(),
                                    detalleCompra.getProducto().getNombreProducto(),
                                    detalleCompra.getCantidad(),
                                    detalleCompra.getPrecioUnitario())
                    ).collect(Collectors.toList())
            );
            return ResponseEntity.ok(compraDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /*@GetMapping("/compras-diarias/{fecha}")
    public ResponseEntity<List<TotalComprasPorDiaDto>> obtenerComprasPorFecha(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)Date fecha){
        List<TotalComprasPorDiaDto> compras = compraRepository.obtenerTotalComprasPorFecha(fecha);

        return compras.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(compras);
    }*/

    @GetMapping("/compras-diarias/total/{fecha}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ALMACENISTA')")
    public ResponseEntity<TotalComprasPorDiaDto> obtenerTotalComprasFecha(@PathVariable @DateTimeFormat
            (iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {

        // Convertir LocalDate a java.util.Date en el rango del día
        ZoneId zona = ZoneId.of("America/Bogota");

        ZonedDateTime startOfDay = fecha.atStartOfDay(zona);
        ZonedDateTime endOfDay = fecha.plusDays(1).atStartOfDay(zona);

        Date inicioDelDia = Date.from(startOfDay.toInstant());
        Date finDelDia = Date.from(endOfDay.toInstant());

        List<TotalComprasPorDiaDto> resultados =
                compraRepository.obtenerTotalComprasPorFecha(inicioDelDia, finDelDia);

        Double total = resultados.stream()
                .mapToDouble(TotalComprasPorDiaDto::totalCompras)
                .sum();

        TotalComprasPorDiaDto respuesta = new TotalComprasPorDiaDto
                (Date.from(fecha.atStartOfDay(zona).toInstant()), total);
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/filtroCompras")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ALMACENISTA')")
    public ResponseEntity<Map<String, Object>> filtroCompras(
            @PageableDefault(size = 20) Pageable paginacion,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)LocalDate fechaFin
            /*@RequestParam(required = false) String proveedor*/) {
        Page<Compra> resultados = compraRepository.findAll((root, query, cb) -> {
            List<Predicate> filtros = new ArrayList<>();
            if (fechaInicio != null){
                filtros.add(cb.greaterThanOrEqualTo(root.get("fechaCompra"),
                        fechaInicio.atStartOfDay()));
            }
            if (fechaFin != null){
                filtros.add(cb.lessThanOrEqualTo(root.get("fechaCompra"),fechaFin.atTime(23,59,59)));
            }
            return cb.and(filtros.toArray(new Predicate[0]));
        }, paginacion);

        Page<CompraDto> comprasDto = resultados.map(compra ->
                new CompraDto(
                        compra.getId(),
                        compra.getFechaCompra(),
                        compra.getTotalCompra(),
                        compra.getNumeroFactura(),
                        compra.getProveedor().getId(),
                        compra.getDetalleCompraList().stream().map(detalleCompra ->
                                new DetalleCompraDto(
                                        detalleCompra.getId(),
                                        detalleCompra.getProducto().getId(),
                                        detalleCompra.getProducto().getNombreProducto(),
                                        detalleCompra.getCantidad(),
                                        detalleCompra.getPrecioUnitario())
                        ).collect(Collectors.toList())
                ));

        Map<String, Object> response = new HashMap<>();
        response.put("compras", comprasDto.getContent());
        response.put("totalPaginas", comprasDto.getTotalPages());
        response.put("totalElementos", comprasDto.getTotalElements());
        response.put("paginaActual", comprasDto.getNumber());

        return ResponseEntity.ok(response);
    }
}
