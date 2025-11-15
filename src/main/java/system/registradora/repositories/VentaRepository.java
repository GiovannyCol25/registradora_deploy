package system.registradora.repositories;

import system.registradora.domain.Venta;
import system.registradora.dto.TotalVentasPorDiaDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import system.registradora.dto.UtilidadPorPeriodoDto;

import java.util.Date;
import java.util.List;

public interface VentaRepository extends JpaRepository<Venta, Long>, JpaSpecificationExecutor<Venta> {

    @Query("SELECT v FROM Venta v ORDER BY v.fechaVenta DESC")
    Page<Venta> listarVentas(Pageable paginacion);

    // Total de ventas por día
    @Query("SELECT new system.registradora.dto.TotalVentasPorDiaDTO(v.fechaVenta, SUM(v.totalVenta)) " +
            "FROM Venta v WHERE DATE(v.fechaVenta) = CURRENT_DATE GROUP BY v.fechaVenta")
    TotalVentasPorDiaDTO obtenerTotalVentasDiarias();

    @Query("""
            SELECT new system.registradora.dto.TotalVentasPorDiaDTO(v.fechaVenta, SUM(v.totalVenta))
            FROM Venta v
            WHERE v.fechaVenta >= :inicio AND v.fechaVenta < :fin
            GROUP BY v.fechaVenta
            """)
    List<TotalVentasPorDiaDTO> obtenerTotalVentasPorFecha(
            @Param("inicio") Date inicio, @Param("fin") Date fin);

    @Query("""
        SELECT new system.registradora.dto.UtilidadPorPeriodoDto(
            v.fechaVenta,
            SUM((dv.precioUnitario - dv.precioCompra) * dv.cantidad)
        )
        FROM Venta v
        JOIN v.detalles dv
        WHERE v.fechaVenta >= :fechaInicio AND v.fechaVenta < :fechaFin
        GROUP BY v.fechaVenta
    """)
    List<UtilidadPorPeriodoDto> obtenerUtilidadPorFecha(
            @Param("inicio") Date fechaInicio,
            @Param("fin") Date FechaFin
    );

}
