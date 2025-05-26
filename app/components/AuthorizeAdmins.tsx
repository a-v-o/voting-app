import { authorizeAdmin } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function AuthorizeAdmins() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <form
        className="h-full flex flex-col gap-4 justify-center items-center"
        action={authorizeAdmin}
      >
        <Label htmlFor="adminEmail">Admin&apos;s Email: </Label>
        <Input type="text" name="adminEmail" id="adminEmail" />
        <Button>Authorize</Button>
      </form>
    </div>
  );
}
