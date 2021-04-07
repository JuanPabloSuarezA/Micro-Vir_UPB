import LayoutUser from "../layouts/LayoutUser";
import LayoutAdmin from "../layouts/LayoutAdmin";

//User pages
import Home from "../pages/User/Home";
import UploadImages from "../pages/User/UploadImages";
import InfoImagen from "../pages/User/InfoImagen";

//Admin pages
import AdminHome from "../pages/Admin/AdminHome";

//Other
import Error404 from "../pages/Error404";
import Login from "../pages/Login";
import Perfil from "../pages/Perfil";

import StreamingHome from "../pages/User/video/StreamingHome";
import VideoView from "../pages/User/video/VideoView";

const routes = [
  {
    path: "/admin",
    component: LayoutAdmin,
    exact: false,

    routes: [
      {
        path: "/admin",
        component: AdminHome,
        exact: true,
      },
      {
        component: Error404,
      },
    ],
  },
  {
    path: "/",
    exact: false,
    component: LayoutUser,
    routes: [
      {
        path: "/",
        exact: true,
        component: Home,
      },
      {
        path: "/upload",
        exact: true,
        component: UploadImages,
      },
      {
        path: "/image/:id",
        exact: true,
        component: InfoImagen,
      },
      {
        path: "/profile",
        exact: true,
        component: Perfil,
      },
      {
        path: "/videos",
        exact: true,
        component: StreamingHome,
      },
      {
        path: "/videos/:idVideo",
        exact: true,
        component: VideoView,
      },
      {
        component: Error404,
      },
    ],
  },
];
export default routes;
