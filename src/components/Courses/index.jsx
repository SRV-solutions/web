import { useState } from 'react';
import { Container, Typography, TextField, MenuItem, Button, Box, Select, InputLabel, FormControl } from '@mui/material';
import Swal from 'sweetalert2';
import styles from './style.module.css';

export default function Courses() {
    const [formData, setFormData] = useState({
        entry1672662118: '', // Nombre y Apellido
        entry1364541462: '', // Email
        entry1886143272: '', // 
        entry1351148002: '', // 
        entry466204675: '', // Interés
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData(e.target);

        const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeA-rRPXg-_eATN1GDX90JZfgv8xA0-vJp5b10JciTD4-60eA/formResponse';
        console.log(formData);

        const data = new URLSearchParams();
        data.append('entry.1672662118', formData.entry1672662118);
        data.append('entry.1364541462', formData.entry1364541462);
        data.append('entry.1886143272', formData.entry1886143272);//colegio
        data.append('entry.1351148002', formData.entry1351148002);//curso
        data.append('entry.466204675', formData.entry466204675);//INTERES

        try {
            const a = await fetch(formUrl, {
                method: "POST",
                mode: "no-cors",  // Permite el envío sin una respuesta CORS (necesario para Google Forms)
                body: data
            });
            console.log(a);

            Swal.fire({
                icon: 'success',
                title: '¡Inscripción enviada!',
                text: 'Te contactaremos pronto.',
                confirmButtonText: 'Ok'
            });

            e.target.reset(); // opcional: limpia el form

        } catch (error) {
            console.log(error);

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Hubo un problema al enviar el formulario.',
            });
        }
    };

    return (
        <Box className={styles.coursesSection}>
            <Container maxWidth="sm">
                <form onSubmit={handleSubmit}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Inscribite a los Cursos
                    </Typography>

                    <TextField
                        label="Nombre y Apellido"
                        name="entry1672662118"
                        fullWidth
                        required
                        margin="normal"
                        value={formData.entry1672662118}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Email"
                        name="entry1364541462"
                        type="email"
                        fullWidth
                        required
                        margin="normal"
                        value={formData.entry1364541462}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Nombre del colegio"
                        name="entry1886143272"
                        fullWidth
                        required
                        margin="normal"
                        value={formData.entry1886143272}
                        onChange={handleChange}
                    />

                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="curso-label">Curso</InputLabel>
                        <Select
                            labelId="curso-label"
                            name="entry1351148002"
                            value={formData.entry1351148002}
                            onChange={handleChange}
                        >
                            <MenuItem value="3ro">3ro</MenuItem>
                            <MenuItem value="4to">4to</MenuItem>
                            <MenuItem value="5to">5to</MenuItem>
                            <MenuItem value="6to">6to</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="interes-label">¿Qué curso te interesa?</InputLabel>
                        <Select
                            labelId="interes-label"
                            name="entry466204675"
                            value={formData.entry466204675}
                            onChange={handleChange}
                        >
                            <MenuItem value="Fundamentos de Python">Fundamentos de Python</MenuItem>
                            <MenuItem value="Fundamentos de BackEnd en JavaScript">
                                Fundamentos de BackEnd en JavaScript
                            </MenuItem>
                            <MenuItem value="BackEnd Avanzado en JavaScript">BackEnd Avanzado en JavaScript</MenuItem>
                            <MenuItem value="Todos">Todos</MenuItem>
                        </Select>
                    </FormControl>

                    <Box mt={3} display="flex" justifyContent="center">
                        <Button variant="contained" color="primary" type="submit">
                            Enviar
                        </Button>
                    </Box>
                </form>
            </Container>
        </Box>
    );
}
