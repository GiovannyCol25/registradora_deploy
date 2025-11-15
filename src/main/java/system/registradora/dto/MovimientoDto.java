package system.registradora.dto;

import system.registradora.domain.TipoMovimiento;

import java.util.Date;

public record MovimientoDto(
        Long id,
        Date fechaMovimiento,
        int cantidad,
        TipoMovimiento tipoMovimiento
) {
}
