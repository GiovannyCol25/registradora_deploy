package system.registradora.repositories;

import system.registradora.domain.Cliente;
import system.registradora.dto.ClienteDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    @Query("SELECT new system.registradora.dto.ClienteDto(c.id, c.nombre, c.telefono) FROM Cliente c")
    List<ClienteDto> listarClientes();

    @Query("SELECT p FROM Cliente p WHERE LOWER(p.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))")
    List<Cliente> findByNombreClienteContainingIgnoreCase(String nombre);
}
