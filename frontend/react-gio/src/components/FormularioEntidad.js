// FormularioEntidad.js

function FormularioEntidad({ campos, valores, onChange, onSubmit, titulo }) {
    return (
      <form onSubmit={onSubmit}>
        <h3>{titulo}</h3>
        {campos.map((campo) => (
          <div className="mb-3" key={campo.nombre}>
            <label className="form-label">{campo.label}</label>
            <input
              type={campo.tipo}
              name={campo.nombre}
              value={valores[campo.nombre] || ''}
              onChange={onChange}
              className="form-control"
            />
          </div>
        ))}
  
        <button type="submit" className="btn btn-primary">Guardar</button>
      </form>
    );
  }
  
  export default FormularioEntidad;
  