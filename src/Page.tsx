import React from "react";

export default function Page(props: { children: React.ReactNode }) {
  return (
    <div className="w-[min(90%,700px)] mx-auto my-2 shadow-lg border border-[1px] border-gray-400 p-3">
      <h1 className="font-extrabold text-3xl">4.602 Image Reviewer</h1>
      <div>{props.children}</div>
      <footer className="text-gray-500 mt-5 text-center">
        &copy; 2024-{new Date().getFullYear()}{" "}
        <a target="_blank" href="https://junic.kim" className="underline">
          Juni Kim
        </a>
      </footer>
    </div>
  );
}
