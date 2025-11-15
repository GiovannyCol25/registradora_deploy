package system.registradora.controller;

import jakarta.persistence.EntityNotFoundException;
import system.registradora.domain.Producto;
import system.registradora.repositories.ProductoRepository;
import system.registradora.dto.ProductoDto;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
@RequestMapping("/productos")
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;

    public ProductoController(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

        @PostMapping
        @Transactional
        @PreAuthorize("hasRole('ADMIN') or hasRole('ALMACENISTA')")
        public ResponseEntity<List<ProductoDto>> registrarProducto (@RequestBody List<ProductoDto> productoDtos){
            List<ProductoDto> productosCreados = productoDtos.stream().map(productoDto -> {
                Producto producto = new Producto();

                producto.setNombreProducto(productoDto.nombreProducto());
                producto.setPrecioVenta(productoDto.precioVenta());
                producto.setCodigoBarras(productoDto.codigoBarras());
                producto.setStock(productoDto.stock());

                producto = productoRepository.save(producto);

                return new ProductoDto(
                        producto.getId(),
                        producto.getNombreProducto(),
                        producto.getPrecioVenta(),
                        producto.getCodigoBarras(),
                        producto.getStock()
                );
            }).toList();
            return ResponseEntity.status(HttpStatus.CREATED).body(productosCreados);
        }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ALMACENISTA')")
    public ResponseEntity<ProductoDto> actualizarProducto(
            @PathVariable Long id,
            @RequestBody ProductoDto dto) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado"));

        producto.setNombreProducto(dto.nombreProducto());
        producto.setPrecioVenta(dto.precioVenta());
        producto.setCodigoBarras(dto.codigoBarras());
        producto.setStock(dto.stock());

        Producto actualizado = productoRepository.save(producto);

        return ResponseEntity.ok(new ProductoDto(
                actualizado.getId(),
                actualizado.getNombreProducto(),
                actualizado.getPrecioVenta(),
                actualizado.getCodigoBarras(),
                actualizado.getStock()
        ));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ALMACENISTA', 'VENDEDOR')")
    public ResponseEntity<ProductoDto>consultaProductoId(@PathVariable Long id){
        Optional<Producto> productoConsultado = productoRepository.findByIdProducto(id);
        if (productoConsultado.isPresent()){
            Producto producto = productoConsultado.get();
            ProductoDto productoDto = new ProductoDto(
                    producto.getId(),
                    producto.getNombreProducto(),
                    producto.getPrecioVenta(),
                    producto.getCodigoBarras(),
                    producto.getStock()
            );
            return ResponseEntity.ok(productoDto);
        }else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/nombre/{nombre}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ALMACENISTA', 'VENDEDOR')")
    public ResponseEntity<List<ProductoDto>> consultaProductoVariosNombres(@PathVariable String nombre) {
        String productoProcesado = nombre.trim().toLowerCase();
        List<Producto> productosConsultados = productoRepository.findByNombreProductoContainingIgnoreCase(nombre);

        if (!productosConsultados.isEmpty()) {
            List<ProductoDto> productosDto = productosConsultados.stream()
                    .map(producto -> new ProductoDto(
                            producto.getId(),
                            producto.getNombreProducto(),
                            producto.getPrecioVenta(),
                            producto.getCodigoBarras(),
                            producto.getStock()
                    )).collect(Collectors.toList());

            return ResponseEntity.ok(productosDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

//    @GetMapping("/nombre/{nombre}")
//    public ResponseEntity<ProductoDto>consultaProductoNombre(@PathVariable String nombre){
//        String productoProcesado = nombre.trim().toLowerCase();
//        Optional<Producto> productoConsultado = productoRepository.findByNombreProducto(nombre);
//        if (productoConsultado.isPresent()){
//            Producto producto = productoConsultado.get();
//            ProductoDto productoDto = new ProductoDto(
//                    producto.getId(),
//                    producto.getNombreProducto(),
//                    producto.getPrecioVenta(),
//                    producto.getCodigoBarras()
//            );
//            return ResponseEntity.ok(productoDto);
//        }else {
//            return ResponseEntity.notFound().build();
//        }
//    }

    @GetMapping("/codigoBarras/{codigoBarras}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ALMACENISTA', 'VENDEDOR')")
    public ResponseEntity<ProductoDto>consultaProductoCodigoBarras(@PathVariable("codigoBarras") Long codigoBarras){
        Optional<Producto>productoBuscado = productoRepository.findByCodigoBarras(codigoBarras);
        if (productoBuscado.isPresent()){
            Producto producto = productoBuscado.get();
            ProductoDto productoDto = new ProductoDto(
                    producto.getId(),
                    producto.getNombreProducto(),
                    producto.getPrecioVenta(),
                    producto.getCodigoBarras(),
                    producto.getStock()
            );
            return ResponseEntity.ok(productoDto);
        }else {
            return ResponseEntity.notFound().build();
        }
    }
}
