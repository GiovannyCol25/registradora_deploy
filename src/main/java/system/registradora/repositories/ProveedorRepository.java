package system.registradora.repositories;

import system.registradora.domain.Proveedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProveedorRepository extends JpaRepository<Proveedor, Long> {

    @Query("SELECT p FROM Proveedor p WHERE LOWER(p.razonSocial) LIKE LOWER(CONCAT('%', :razonSocial, '%'))")
    List<Proveedor> findByRazonSocialContainingIgnoreCase(String razonSocial);
}
