package system.registradora.dto;

import java.util.Date;

public record TotalVentasPorDiaDTO(
        Date fecha,
        Double totalVentas
) {
}
