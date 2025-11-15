package system.registradora.dto;

public record DetalleVentaDto(
        Long id,
        String nombreProducto,
        Integer cantidad,
        Double precioUnitario,
        Double precioCompra
) {}