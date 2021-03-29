import LayoutUser from "../layouts/LayoutUser";

//User pages
import Home from "../pages/User/Home";
import UploadImages from "../pages/User/UploadImages";
import infoImagen from "../pages/User/InfoImagen";

//Other
import Error404 from "../pages/Error404";
import Login from "../pages/Login";
import Perfil from "../pages/Perfil";

import StreamingHome from "../pages/User/video/StreamingHome";
import VideoView from "../pages/User/video/VideoView";

const routes = [
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
        exact: false,
        component: infoImagen,
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
