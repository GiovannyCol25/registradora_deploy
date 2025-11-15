package system.registradora.dto;

public record DetalleCompraDto(
        Long id,
        Long productoId,
        String nombreProducto,
        Integer cantidad,
        Double precioUnitario
) {
}
