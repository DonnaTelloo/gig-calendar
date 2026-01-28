import LogoKA from "../../../../public/assets/logo-ka.png";
import BejuaKA from "../../../../public/assets/d-bejuashvili-logo.png";
import LogoEN from "../../../../public/assets/logo-en.png";
import BejuaEN from "../../../../public/assets/d-bejuashvili-logo-en.png";
import {useTranslation} from "react-i18next";

const PageLoader = () => {
    const { i18n } = useTranslation();

    return (<div className="page-loader">
        {i18n.language === "ka" ? (
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "2em"
            }}>
                <img src={LogoKA} alt=""/>
                <img src={BejuaKA} alt=""/>
            </div>
        ) : (
            <div>
                <img src={LogoEN} alt=""/>
                <img src={BejuaEN} alt=""/>
            </div>
        )}
    </div>)
};

export default PageLoader;
