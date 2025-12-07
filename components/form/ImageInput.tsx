import { Label } from "../ui/label";

function ImageInput() {
  const name = "image";
  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize">
        Image
      </Label>
      <input
        type="file"
        required
        name={name}
        id={name}
        accept="image/*"
        className="max-w-xs"
      />
    </div>
  );
}
export default ImageInput;
