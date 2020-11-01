import Axios from "axios";
import { IModelGroup } from "./dto";
import { UploadFile } from "antd/lib/upload/interface";

const isDev = process.env.NODE_ENV !== "production";

let baseURL = "";
if (isDev) {
  baseURL = "http://127.0.0.1:8080/api/";
} else {
  baseURL = "http://207.148.26.179/api/";
}

const axios = Axios.create({
  baseURL
});

export async function getPresets() {
  const res = await axios.get<string[]>("/presets");
  return res.data;
}

export async function processImage(input_name: string, input_base64: string) {
  const res = await axios.post<IModelGroup>("/process", {
    input_name,
    input_base64
  });
  return res.data;
}

export async function generateModel(image: string) {
  const res = await axios.post<IModelGroup>("/generate", {
    image
  });
  return res.data;
}
