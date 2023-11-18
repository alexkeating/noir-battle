import { PCDCollection } from "@pcd/pcd-collection";
import { usePassportPopupSetup } from "@pcd/passport-interface";

export default function Popup() {
  const error = usePassportPopupSetup();

  return <div>{error}</div>;
}
