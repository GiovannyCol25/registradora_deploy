package system.registradora.dto;

public record ProductoDto(
        Long id,
        String nombreProducto,
        Double precioVenta,
        String codigoBarras,
        Integer stock
) {
}
