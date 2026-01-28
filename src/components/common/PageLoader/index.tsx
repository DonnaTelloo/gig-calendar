import LogoKA from "../../../../public/assets/logo-ka.png";
import LogoEN from "../../../../public/assets/logo-en.png";
import {useTranslation} from "react-i18next";

const PageLoader = () => {
    const { i18n } = useTranslation();

    return (<div className="page-loader">
        {i18n.language === "ka" ? (
            <img src={LogoKA} alt=""/>
        ) : (
            <img src={LogoEN} alt=""/>
        )}
    </div>)
};

export default PageLoader;
