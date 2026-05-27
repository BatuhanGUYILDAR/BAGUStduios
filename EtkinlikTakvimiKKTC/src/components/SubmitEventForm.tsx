import { CheckCircle2, ImagePlus, Send } from "lucide-react";
import { categories, cities } from "@/lib/mockData";
import type { City, EventCategory } from "@/types/event";
import { Button } from "./Button";

type SubmitEventFormProps = {
  submitted?: boolean;
};

export function SubmitEventForm({ submitted = false }: SubmitEventFormProps) {
  const cityOptions = cities.filter((city): city is City => city !== "Tümü");
  const categoryOptions = categories.filter(
    (category): category is EventCategory => category !== "Tümü"
  );

  return (
    <form action="/submit-event" className="glass-panel rounded-[2rem] p-5 sm:p-7" method="get">
      <input name="submitted" type="hidden" value="1" />

      {submitted ? (
        <div className="mb-6 flex items-start gap-3 rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-emerald-800">
          <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0" size={22} />
          <p className="text-sm font-bold">
            Etkinlik gönderildi. Admin onayından sonra yayınlanacaktır.
          </p>
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <TextField label="Event title" name="title" required />
        <TextField label="Venue name" name="venueName" required />
        <SelectField
          label="City"
          name="city"
          options={cityOptions}
          placeholder="Şehir seç"
          required
        />
        <SelectField
          label="Category"
          name="category"
          options={categoryOptions}
          placeholder="Kategori seç"
          required
        />
        <TextField label="Date" name="date" required type="date" />
        <TextField label="Time" name="time" required type="time" />
        <TextField label="Price minimum" name="priceMin" placeholder="0" type="number" />
        <TextField label="Price maximum" name="priceMax" placeholder="700" type="number" />
        <SelectField
          label="Age limit"
          name="ageLimit"
          options={["18+", "All Ages"]}
          placeholder="Yaş limiti seç"
          required
        />
        <TextField
          label="Instagram link"
          name="instagramUrl"
          placeholder="https://instagram.com/..."
        />
        <TextField label="WhatsApp contact" name="whatsappContact" placeholder="+90..." required />
        <div className="rounded-3xl border border-dashed border-neon-pink/35 bg-white/60 p-5">
          <div className="flex h-full min-h-36 flex-col items-center justify-center text-center">
            <ImagePlus aria-hidden="true" className="text-electric-purple" size={32} />
            <p className="mt-3 text-sm font-black text-ink">Poster upload placeholder</p>
            <p className="mt-2 text-xs font-semibold leading-5 text-slatecopy">
              Gerçek dosya yükleme yok. Backend bağlanınca aktif edilebilir.
            </p>
          </div>
        </div>
      </div>

      <label className="mt-5 grid gap-2 text-sm font-extrabold text-ink">
        Description
        <textarea
          className="focus-ring min-h-36 rounded-3xl border border-white/80 bg-white/78 px-4 py-3 text-sm font-semibold leading-6 text-ink shadow-sm backdrop-blur placeholder:text-mutedcopy"
          name="description"
          placeholder="Etkinlik atmosferi, program, giriş notları..."
          required
        />
        <span className="text-xs font-bold text-rose-600">Bu alan zorunludur.</span>
      </label>

      <label className="mt-5 flex items-start gap-3 rounded-3xl bg-white/62 p-4 text-sm font-bold leading-6 text-slatecopy">
        <input
          className="mt-1 h-5 w-5 rounded border-white text-electric-purple focus:ring-electric-purple"
          name="responsibility"
          required
          type="checkbox"
          value="accepted"
        />
        <span>
          Etkinlik bilgileri ve yasal sorumlulukların organizatör/mekan tarafına ait olduğunu kabul
          ediyorum.
          <span className="mt-1 block text-xs text-rose-600">
            Yayın öncesi sorumluluk onayı gereklidir.
          </span>
        </span>
      </label>

      <Button className="mt-6 w-full sm:w-auto" size="lg" type="submit">
        <Send aria-hidden="true" size={19} />
        Etkinliği Gönder
      </Button>
    </form>
  );
}

function TextField({
  label,
  name,
  placeholder,
  required = false,
  type = "text"
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "date" | "time" | "number";
}) {
  return (
    <label className="grid gap-2 text-sm font-extrabold text-ink">
      {label}
      <input
        className="focus-ring h-12 rounded-2xl border border-white/80 bg-white/78 px-4 text-sm font-semibold text-ink shadow-sm backdrop-blur placeholder:text-mutedcopy"
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
      {required ? <span className="text-xs font-bold text-rose-600">Bu alan zorunludur.</span> : null}
    </label>
  );
}

function SelectField<T extends string>({
  label,
  name,
  options,
  placeholder,
  required = false
}: {
  label: string;
  name: string;
  options: T[];
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-extrabold text-ink">
      {label}
      <select
        className="focus-ring h-12 rounded-2xl border border-white/80 bg-white/78 px-4 text-sm font-semibold text-slatecopy shadow-sm backdrop-blur"
        defaultValue=""
        name={name}
        required={required}
      >
        <option disabled value="">
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {required ? <span className="text-xs font-bold text-rose-600">Bu alan zorunludur.</span> : null}
    </label>
  );
}
