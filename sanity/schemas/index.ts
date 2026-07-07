import project from './project';
import service from './service';
import marqueeImage from './marqueeImage';
import preloader from './preloader';
import landingPage from './landingPage';

// Order controls how types appear in the Studio's "create" menus.
// `preloader` is an object type embedded in landingPage (not a document), but it
// must still be registered here so the schema can resolve it.
export const schemaTypes = [landingPage, project, service, marqueeImage, preloader];
