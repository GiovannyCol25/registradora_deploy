package system.registradora.controller;

import org.springframework.cglib.core.Local;
import system.registradora.domain.*;
import system.registradora.domain.usuario.Usuario;
import system.registradora.domain.usuario.UsuarioRepository;
import system.registradora.dto.*;
import system.registradora.repositories.*;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import system.registradora.service.VentaService;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

import static system.registradora.infra.security.AuthUtils.getLoginFromToken;

@CrossOrigin(origins = "http://localhost:5500") // Ajusta el puerto si es diferente
@RestController
@RequestMapping("/ventas")
public class VentaController {

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
    private VentaService ventaService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<VentaDto> registrarVenta(@RequestBody VentaDto ventaDto) {
        VentaDto respuesta = ventaService.registrarVenta(ventaDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<Map<String, Object>> listarVentas(@PageableDefault(size = 20) Pageable paginacion) {
        Map<String, Object> respuesta = ventaService.listarVentas(paginacion);
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<VentaDto> listarVentasId(@PathVariable Long id) {
        return ventaService.listarVentasId(id)
                .map(ResponseEntity::ok)
                .orElseGet(()-> ResponseEntity.notFound().build());
    }

    @GetMapping("/ventas-diarias/total/{fecha}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<TotalVentasPorDiaDTO> obtenerTotalVentasFecha(@PathVariable @DateTimeFormat
            (iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {

        TotalVentasPorDiaDTO respuesta = ventaService.obtenerTotalVentasFecha(fecha);
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/por-producto")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<List<ConsultaVentasPorProductoDto>> consultaVentasPorProducto(
            @RequestParam(value = "nombreProducto") String nombreProducto) {

            // 4️⃣ Filtrar solo las ventas del día actual y por producto
        List<ConsultaVentasPorProductoDto> ventasFiltradas = ventaService.consultaVentasPorProducto(nombreProducto);

        System.out.println("Ventas filtradas: " + ventasFiltradas);
        // 5️⃣ Validar si hay resultados
        if (ventasFiltradas.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(ventasFiltradas);
    }

    @GetMapping("/filtroVentas")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<Map<String, Object>> filtroVentas(
            @PageableDefault(size = 20) Pageable paginacion,
            @RequestParam(required = false) String formaPago,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {

        Map<String, Object> respuesta = ventaService.filtroVentas(paginacion, formaPago, fechaInicio, fechaFin);
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/utilidad")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UtilidadPorPeriodoDto> getUtilidadPorRango(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        return ResponseEntity.ok(ventaService.calcularUtilidadPorRango(fechaInicio, fechaFin));
    }

    @GetMapping("/utilidad/diaria")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UtilidadPorPeriodoDto> getUtilidadDiaria() {
        return ResponseEntity.ok(ventaService.calcularUtilidadDiaria());
    }

    @GetMapping("/utilidad/semanal")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UtilidadPorPeriodoDto> getUtilidadSemanal() {
        return ResponseEntity.ok(ventaService.calcularUtilidadSemanal());
    }

    @GetMapping("/utilidad/mensual")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UtilidadPorPeriodoDto> getUtilidadMensual() {
        return ResponseEntity.ok(ventaService.calcularUtilidadMensual());
    }
}