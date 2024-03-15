"use client";
import FileIcon from "@/Icons/FileIcon";
import PdfIcon from "@/Icons/PdfIcon";
import XIcon from "@/Icons/XIcon";
import { useEffect, useState } from "react";
import React from "react";

const page = () => {
    const [file, setFile] = useState<any>();
    const [draggingOver, setDraggingOver] = useState<boolean>(false)
    const [XOver, setXOver] = useState<boolean>(false);

    const handleDrop = (ev: any) => {
        console.log("File(s) dropped");

        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
        setFile(ev.dataTransfer.files[0])
        setDraggingOver(false);
    }

    const handleDragOver = (e: any) => {
        console.log("File in dropzone");
        setDraggingOver(true);
        e.preventDefault();
    }

    const cancelHandler = () => {
        setFile(undefined);
    }

    useEffect(() => {
        if (file) {
            const pdf = window.URL.createObjectURL(file);
            const object = document.querySelector("object");
            if (object?.data) object.data = pdf;
        }
    }, [file])

    return (
        <div className="wrapper">
            <div className="header">
                Implementasi Algoritma <span>Rapid Automatic Keyword Extraction (RAKE)</span> pada Pembuatan Indeks Buku
            </div>
            <div className="content">
                {!file && <label className={`dropPdf ${draggingOver ? "dragging" : ""}`} onDrop={handleDrop} onDragOver={handleDragOver} onClick={(e) => console.log(e)}>
                    <PdfIcon color={draggingOver ? "#420000" : "#B8B8B8"} />
                    <input type="file" accept="application/pdf" className="pdfInput" onChange={(e) => {
                        if (!e.target.files) return;
                        setFile(e.target.files[0]);
                    }} />
                    <div>Drop file PDF buku atau <span>browse</span></div>
                </label>}

                {file && 
                    <div className="havePdf">
                        <object className="pdf-view" data="" width="100%" height="400px"/>

                        <div className="form">
                            <div className="box">
                                <div className="topbar">
                                    <div className="filename">
                                        <FileIcon/> <div>{file?.name}</div>
                                    </div>
                                    <div className="cancel" onMouseOver={() => setXOver(true)} onMouseLeave={() => setXOver(false)} onClick={cancelHandler}><XIcon color={XOver ? "#ff0000" : "#D41818"} /></div>
                                </div>
                                <div className="fields">
                                    <div className="row">
                                        <label htmlFor="halaman">Halaman</label>
                                        <div className="halamanInp">
                                            <input type="text" />
                                            <div>-</div>
                                            <input type="text" />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <label htmlFor="judul">Judul Buku</label>
                                        <input type="text" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default page