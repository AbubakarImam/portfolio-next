import { Assemblies } from "@/components/Assemblies";
import { BackCover } from "@/components/BackCover";
import { BillOfMaterials } from "@/components/BillOfMaterials";
import { CoverSheet } from "@/components/CoverSheet";
import { ServiceRequest } from "@/components/ServiceRequest";
import { Specification } from "@/components/Specification";
import { TableOfContents } from "@/components/TableOfContents";

export default function Home() {
  return (
    <>
      <TableOfContents />
      <main className="flex-1">
        <CoverSheet />
        <Specification />
        <BillOfMaterials />
        <Assemblies />
        <ServiceRequest />
      </main>
      <BackCover />
    </>
  );
}
