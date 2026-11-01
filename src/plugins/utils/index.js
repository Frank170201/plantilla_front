import { useDashboardStore } from "@/store/dashboard";

export const useUtils = () => {
  const canNavigate = async (path) => {
    // const staticsRoutes = ['pagosPendientes'];
    // if (staticsRoutes.includes(path.name)) return true;

    const { menu, getMenu } = useDashboardStore();
    let response;
    if (menu.length === 0) response = await getMenu();
    return (menu.length > 0 ? menu : response.data).some(
      (item) =>
        item.nombre_uri === path.name ||
        item.childrens.some((item2) => item2.nombre_uri === path.name)
    );
  };
  return {
    canNavigate,
  };
};
export default useUtils;
