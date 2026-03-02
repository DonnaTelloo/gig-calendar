import LogoKA from "../../../../public/assets/logo-ka.png";
import BejuaEN from "../../../../public/assets/d-bejuashvili-logo-en.png";
import LogoEN from "../../../../public/assets/logo-en.png";
import BejuaKA from "../../../../public/assets/d-bejuashvili-logo.png";
import {useTranslation} from "react-i18next";

const PageLoader = () => {
    const { i18n } = useTranslation();

    return (<div className="page-loader">
        {i18n.language === "ka" ? (
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "2em"
            }}>
                <img src={BejuaKA} alt=""/>
                {/*<img src={LogoKA} style={{*/}
                {/*    width: '15vh'*/}
                {/*}} alt=""/>*/}
            </div>
        ) : (
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "2em"
            }}>
                <img src={BejuaEN} alt=""/>
                {/*<img src={LogoEN} style={{*/}
                {/*    width: '15vh'*/}
                {/*}} alt=""/>*/}
            </div>
        )}
    </div>)
};

export default PageLoader;
