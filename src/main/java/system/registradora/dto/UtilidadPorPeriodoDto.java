package system.registradora.dto;

import java.util.Date;

public record UtilidadPorPeriodoDto(
        Date fecha,
        Double totalUtilidad
) {
}
