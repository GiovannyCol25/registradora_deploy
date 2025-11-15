package system.registradora.dto;

import java.util.Date;
import java.util.List;

public record CompraDto(
        Long id,
        Date fechaCompra,
        Double totalCompra,
        String numeroFactura,
        Long proveedorId,
        List<DetalleCompraDto> detalleCompraDtoList
) {
}
