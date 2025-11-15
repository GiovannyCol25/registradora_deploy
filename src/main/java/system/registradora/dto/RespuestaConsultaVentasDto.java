package system.registradora.dto;

import java.util.List;

public record RespuestaConsultaVentasDto(
        String mensaje,
        List<ConsultaVentasPorProductoDto> ventas
) {
}
