package system.registradora.dto;

import system.registradora.domain.usuario.AutenticacionUsuarioDto;

public record EmpleadoUsuarioDto(
        Long id,
        String nombreEmpleado,
        String cargo,
        Long telefono,
        AutenticacionUsuarioDto usuario
) {
}
