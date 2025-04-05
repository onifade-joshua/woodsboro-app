import LogoImage from "../assets/woodsboro-logo.jpeg";

export default function Logo() {
    return (
        <div className="mr-2 bg-gradient-to-br w-8 h-8 rounded-lg flex items-center justify-center">
            <img src={LogoImage} alt="Logo" className="w-6 h-6" />
        </div>
    );
}