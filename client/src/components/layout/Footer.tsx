import LOGO from "../../assets/football-live-score-logo.png";

const Footer = () => {
  return (
    <footer className="bg-gray-200 border-t-2 border-gray-300 shadow-inner">
      <div className="mx-auto p-4 flex flex-col md:flex-row justify-between items-center">
        {/* Logo & name */}
        <div className="flex items-center mb-2 md:mb-0">
          <img src={LOGO} alt="Football Live" className="w-12 mr-2" />
          <span className="font-semibold text-md md:text-lg text-gray-700">
            Football Live Score
          </span>
        </div>
        {/* Copyright */}
        <div className="text-gray-700 text-xs md:text-sm">
          &copy; {new Date().getFullYear()} Football Live Score. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
