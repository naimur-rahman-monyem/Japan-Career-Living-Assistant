"use client";

export default function CitySelector({ cities, selected }: { cities: string[]; selected: string }) {
  return <form action="/living-cost" className="card flex items-center gap-3 p-3"><label className="text-sm font-bold" htmlFor="city">Choose city</label><select id="city" name="city" defaultValue={selected} className="rounded-lg border p-2" onChange={(event) => { window.location.href = `/living-cost?city=${encodeURIComponent(event.target.value)}`; }}>{cities.map((city) => <option value={city} key={city}>{city}</option>)}</select></form>;
}
