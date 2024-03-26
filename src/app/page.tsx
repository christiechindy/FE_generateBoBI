"use client";
import FileIcon from "@/Icons/FileIcon";
import PdfIcon from "@/Icons/PdfIcon";
import UploadIcon from "@/Icons/UploadIcon";
import XIcon from "@/Icons/XIcon";
import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";

const page = () => {
    const [file, setFile] = useState<any>();
    const [jsonFile, setJsonFile] = useState<any>();
    const [judul, setJudul] = useState<string>("");
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

    /* --- Form ------------------ */
    const [terlangkah, setTerlangkah] = useState<boolean|undefined>();
    const [stepOnMiddle, setStepOnMiddle] = useState<boolean|undefined>();

    const processTheBook = async () => {
        const fileName = "tesssr.docx"
        const formData = new FormData();
        formData.append("filePdf", file);
        formData.append("judul", judul);
        formData.append("adaJSON", "1");
        formData.append("fileJson", jsonFile);

        const response = await axios({
            url: "http://localhost:1313/generate-rake",
            method: "POST",
            responseType: "blob",
            data: formData
        })
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
    
        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);

        // Append the link to the document and trigger the click event
        document.body.appendChild(link);
        link.click();

        // Remove the link from the document
        document.body.removeChild(link);
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
                    <PdfIcon color={draggingOver ? "#1300F3" : "#0070F3"} />
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
                                        <FileIcon/> <div>{file?.name?.length > 40 ? `${file?.name?.substring(0,40)}....pdf` : file?.name}</div>
                                    </div>
                                    <div className="cancel" onMouseOver={() => setXOver(true)} onMouseLeave={() => setXOver(false)} onClick={cancelHandler}><XIcon color={XOver ? "#ff0000" : "#D41818"} /></div>
                                </div>
                                <div className="fields">
                                    <div className="row">
                                        <label htmlFor="judulBuku">Judul Buku</label>
                                        <input type="text" id="judulBuku" className="input" value={judul} onChange={e => setJudul(e.target.value)} />
                                    </div>
                                    <div className="row">
                                        <label className="label_lihe">Apakah ada nomor halaman yang terlangkah?</label>
                                        <div className="onerow">
                                            <div className="radio">
                                                <input type="radio" name="terlangkah" value="ya" id="ya" onChange={() => setTerlangkah(true)} checked={terlangkah===true} />
                                                <label htmlFor="ya">Ya</label>
                                            </div>
                                            <div className="radio">
                                                <input type="radio" name="terlangkah" value="tidak" id="tidak" onChange={() => setTerlangkah(false)} checked={terlangkah===false} />
                                                <label htmlFor="tidak">Tidak</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <label className="label_lihe">Apakah ada halaman tengah yang tidak ingin diindeks?</label>
                                        <div className="onerow">
                                            <div className="radio">
                                                <input type="radio" name="stepOnMiddle" value="ya" id="ya_" onChange={() => setStepOnMiddle(true)} checked={stepOnMiddle===true} />
                                                <label htmlFor="ya_">Ya</label>
                                            </div>
                                            <div className="radio">
                                                <input type="radio" name="stepOnMiddle" value="tidak" id="tidak_" onChange={() => setStepOnMiddle(false)} checked={stepOnMiddle===false} />
                                                <label htmlFor="tidak_">Tidak</label>
                                            </div>
                                        </div>
                                    </div>
                                    {(terlangkah!==undefined && stepOnMiddle!==undefined) ?
                                        terlangkah===false && stepOnMiddle===false ?
                                            <div className="row">
                                                <label htmlFor="halaman">Halaman yang ingin dibuatkan indeks</label>
                                                <div className="halamanInp">
                                                    <input type="number" className="input" />
                                                    <div>-</div>
                                                    <input type="number" className="input" />
                                                </div>
                                            </div>
                                        :
                                            <div className="row">
                                                <label htmlFor="jsonfile" className="label_lihe">Unggah JSON file berisi range halaman tiap bab/section dan selisih nomor halaman yang dilabeli dan urutan halaman keseluruhan</label>
                                                <a href="/halaman.json" download="halaman.json" className="linkjsonformat">(download format JSON file)</a>
                                                <input type="file" accept="application/json" id="jsonfile" onChange={(e) => {
                                                    if (!e.target.files) return;
                                                    setJsonFile(e.target.files[0]);
                                                }} />
                                                <label htmlFor="jsonfile" className="input file">
                                                    <UploadIcon />
                                                    <div>{!jsonFile?.name ? "Unggah file json yang sudah diisi" : jsonFile.name}</div>
                                                </label>
                                            </div>
                                    : null}
                                    
                                </div>
                            </div>
                            
                            <button className="processBtn" onClick={processTheBook}>Proses</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default page