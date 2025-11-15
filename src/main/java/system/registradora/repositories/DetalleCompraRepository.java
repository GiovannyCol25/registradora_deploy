package system.registradora.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import system.registradora.domain.DetalleCompra;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DetalleCompraRepository extends JpaRepository<DetalleCompra, Long> {

    //Consulta para obtener el último precio unitario
    @Query(value = """
            SELECT dc.precioUnitario
            FROM DetalleCompra dc
            WHERE dc.producto.id = :productoId
            ORDER BY dc.compra.fechaCompra DESC
            LIMIT 1
            """)
    Double obtenerUltimoPrecioCompra(@Param("productoId") Long productoId);
}
