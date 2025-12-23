import { findCountryByCode } from "@/utils/countries";
import "flag-icons/css/flag-icons.min.css";

function CountryFlagAndName({ countryCode }: { countryCode: string }) {
  const validCountry = findCountryByCode(countryCode);
  const countryName =
    validCountry!.name.length > 20
      ? `${validCountry!.name.substring(0, 20)}...`
      : validCountry!.name;
  return (
    <span className="flex text-sm">
      <span className={`fi fi-${countryCode.toLowerCase()} mr-2`} />
      {countryName}
    </span>
  );
}
export default CountryFlagAndName;
