import { setAppMode } from "../store/action";
const AppMobile = () => {
  return (
    <>
      <button
        onClick={() => {
          setAppMode("desktop");
        }}
      >
        switch to desktop mode
      </button>
    </>
  );
};
export default AppMobile;
