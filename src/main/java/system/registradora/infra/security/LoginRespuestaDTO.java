package system.registradora.infra.security;

public record LoginRespuestaDTO(
        String jwtToken,
        String rol) {
}
