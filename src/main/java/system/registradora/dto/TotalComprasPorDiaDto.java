package system.registradora.dto;

import java.util.Date;

public record TotalComprasPorDiaDto(
        Date fechaCompra,
        Double totalCompras
) {
}
