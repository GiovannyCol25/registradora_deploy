package system.registradora.repositories;

import system.registradora.domain.DetalleVenta;
import system.registradora.dto.DetalleVentaDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Long> {

        @Query("""
            SELECT new system.registradora.dto.DetalleVentaDto(d.id, d.producto.nombreProducto, d.cantidad, d.precioUnitario, d.precioCompra) 
            FROM DetalleVenta d 
            WHERE d.producto.nombreProducto = :nombreProducto
        """)
        List<DetalleVentaDto> findByNombreProducto(@Param("nombreProducto") String nombreProducto);

        @Query("""
            SELECT d
            FROM DetalleVenta d
            WHERE d.venta.fechaVenta BETWEEN :fechaInicio AND :fechaFin
        """)
        List<DetalleVenta> findByRangoFechas(@Param("fechaInicio") Date inicio,
                                             @Param("fechaFin") Date fin);

}
