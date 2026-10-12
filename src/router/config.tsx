import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import PublicLayout from "@/components/feature/PublicLayout";
import AdminLayout from "@/components/admin/AdminLayout";
import Home from "../pages/home/page";
import Servicios from "../pages/servicios/page";
import ServiceDetail from "../pages/servicios/ServiceDetail";
import Cursos from "../pages/cursos/page";
import CourseDetail from "../pages/cursos/CourseDetail";
import Precios from "../pages/precios/page";
import Reservar from "../pages/reservar/page";
import Pago from "../pages/pago/page";
import SobreMi from "../pages/sobre-mi/page";
import Contacto from "../pages/contacto/page";
import AdminLogin from "../pages/admin/login/page";
import AdminDashboard from "../pages/admin/dashboard/page";
import AdminCitas from "../pages/admin/citas/page";
import AdminMensajes from "../pages/admin/mensajes/page";
import AdminServicios from "../pages/admin/servicios/page";
import AdminCursos from "../pages/admin/cursos/page";
import AdminHorarios from "../pages/admin/horarios/page";
import AdminContenido from "../pages/admin/contenido/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "servicios", element: <Servicios /> },
      { path: "servicios/:slug", element: <ServiceDetail /> },
      { path: "cursos", element: <Cursos /> },
      { path: "cursos/:id", element: <CourseDetail /> },
      { path: "precios", element: <Precios /> },
      { path: "reservar", element: <Reservar /> },
      { path: "pago", element: <Pago /> },
      { path: "sobre-mi", element: <SobreMi /> },
      { path: "contacto", element: <Contacto /> },
    ],
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "citas", element: <AdminCitas /> },
      { path: "mensajes", element: <AdminMensajes /> },
      { path: "servicios", element: <AdminServicios /> },
      { path: "cursos", element: <AdminCursos /> },
      { path: "horarios", element: <AdminHorarios /> },
      { path: "contenido", element: <AdminContenido /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;