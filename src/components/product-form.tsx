"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { saveProduct, type FormState } from "@/app/admin/(panel)/products/actions";
import type { Product } from "@/db/schema";

export function ProductForm({ product, categories }: { product?: Product; categories: { id: string; name: string }[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveProduct, undefined);
  const [previews, setPreviews] = useState<string[]>([]);
  const imgs = product?.images ?? [];

  return (
    <form action={action} className="mt-6 grid gap-6 xl:grid-cols-12">
      {product && <input type="hidden" name="id" value={product.id} />}
      <div className="space-y-5 bg-paper p-5 xl:col-span-8">
        <div>
          <label className="label" htmlFor="name">Name</label>
          <input id="name" name="name" required defaultValue={product?.name} className="field" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="categoryId">Collection</label>
            <select id="categoryId" name="categoryId" required defaultValue={product?.categoryId ?? ""} className="field">
              <option value="" disabled>Choose</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="slug">Web address</label>
            <input id="slug" name="slug" defaultValue={product?.slug} placeholder="Made from the name if blank" className="field" />
          </div>
          <div>
            <label className="label" htmlFor="price">Price (₦)</label>
            <input id="price" name="price" type="number" min={1} step={500} required defaultValue={product?.price} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="compareAtPrice">Was price (₦, optional)</label>
            <input id="compareAtPrice" name="compareAtPrice" type="number" min={0} step={500} defaultValue={product?.compareAtPrice ?? ""} className="field" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={4} required defaultValue={product?.description} className="field" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="fabric">Fabric</label>
            <input id="fabric" name="fabric" defaultValue={product?.fabric ?? ""} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="leadTimeDays">Days to make</label>
            <input id="leadTimeDays" name="leadTimeDays" type="number" min={1} defaultValue={product?.leadTimeDays ?? 7} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="colors">Colours (comma separated)</label>
            <input id="colors" name="colors" defaultValue={product?.colors.join(", ")} placeholder="Black, Navy" className="field" />
          </div>
          <div>
            <label className="label" htmlFor="sizes">Standard sizes (comma separated)</label>
            <input id="sizes" name="sizes" defaultValue={product ? product.sizes.join(", ") : "S, M, L, XL, XXL, 3XL"} placeholder="Leave blank for made to measure only" className="field" />
          </div>
        </div>
        <div className="flex flex-wrap gap-6 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" name="bespoke" defaultChecked={product?.bespoke ?? true} className="accent-black" /> Offer made to measure</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} className="accent-black" /> Show on homepage</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="active" defaultChecked={product?.active ?? true} className="accent-black" /> Visible in shop</label>
        </div>
      </div>

      <div className="space-y-5 bg-paper p-5 xl:col-span-4">
        <h2 className="font-semibold">Photos</h2>
        {imgs.length > 0 && (
          <ul className="grid grid-cols-3 gap-3">
            {imgs.map((src, i) => (
              <li key={src} className="text-xs">
                <div className="relative aspect-[3/4] overflow-hidden bg-chalk">
                  <Image src={src} alt="" fill sizes="120px" unoptimized={src.endsWith(".svg")} className="object-cover" />
                </div>
                <label className="mt-1 flex items-center gap-1"><input type="checkbox" name="keepImage" value={src} defaultChecked className="accent-black" /> Keep</label>
                <label className="flex items-center gap-1"><input type="radio" name="cover" value={src} defaultChecked={i === 0} className="accent-black" /> Cover</label>
              </li>
            ))}
          </ul>
        )}
        <div>
          <label className="label" htmlFor="newImages">Add photos</label>
          <input
            id="newImages"
            name="newImages"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            className="block w-full text-sm file:mr-3 file:border-0 file:bg-ink file:px-4 file:py-2 file:text-paper"
            onChange={(e) => setPreviews(Array.from(e.target.files ?? []).map((f) => URL.createObjectURL(f)))}
          />
          <p className="mt-1 text-xs text-stone">Portrait photos (3:4) look best. Up to 8 MB each.</p>
          {previews.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {previews.map((p) => <img key={p} src={p} alt="" className="aspect-[3/4] w-full object-cover" />)}
            </div>
          )}
        </div>
        {state?.error && <p className="text-sm text-coral" role="alert">{state.error}</p>}
        <button disabled={pending} className="btn btn-ink w-full">{pending ? "Saving…" : product ? "Save changes" : "Add product"}</button>
      </div>
    </form>
  );
}
