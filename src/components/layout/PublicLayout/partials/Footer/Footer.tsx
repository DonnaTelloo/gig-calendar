import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
    return <div className="footer">
        <span className='copyright'>© {new Date().getFullYear()} ყველა უფლება დაცულია</span>
        <a href="https://www.instagram.com/sheniistoria" target="_blank" rel="noopener noreferrer" className="social-icon">
            <InstagramIcon />
        </a>
    </div>;
}

export default Footer;
