import { Resource } from "../resources";

export function prepareResources(
    resources: Resource[], 
    serveResources: boolean | undefined
  ): Resource[] {
    if (!serveResources) {
        return resources;
    }
    return serveResource(resources);
}

function serveResource(resources: Resource[]): Resource[] {
    return resources.map(resource => {
        const path = resource.path.substring(resource.path.lastIndexOf("/") + 1);
        return {
            path
        };
    });
}
