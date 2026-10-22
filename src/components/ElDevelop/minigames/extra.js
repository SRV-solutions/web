// Minijuegos propios de cada rol (tercer minijuego): id -> componente.
// Index.jsx los busca acá antes de caer en el switch de los minijuegos clásicos.
import PixelPerfect from "./PixelPerfect";
import Endpoints from "./Endpoints";
import DeployWindow from "./DeployWindow";
import Parches from "./Parches";
import Outliers from "./Outliers";
import SprintPlanner from "./SprintPlanner";
import SimonHelpDesk from "./SimonHelpDesk";
import SpotDiff from "./SpotDiff";

export const EXTRA_GAMES = {
  pixelperfect: PixelPerfect,
  endpoints: Endpoints,
  deploywindow: DeployWindow,
  parches: Parches,
  outliers: Outliers,
  sprintplanner: SprintPlanner,
  simonhelpdesk: SimonHelpDesk,
  spotdiff: SpotDiff,
};
