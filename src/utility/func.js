import axios from "axios";

export const shortenText = (text, limit) => {
  if (text.length > limit) {
    return text.slice(0, limit) + "...";
  }
  return text;
};

export const convertSnakeCaseToText = text => {
  const splittedText = text.split("_");
  let result = "";
  splittedText.forEach(text => {
    result += " " + text.replace(/^\w/, c => c.toUpperCase());
    return null;
  });
  return result.substring(1);
};

export const getRole = () => {
  return localStorage.getItem("role");
};

export const isAdmin = () => {
  return localStorage.getItem("role") === "Admin";
};

export const getUserId = () => {
  return localStorage.getItem("user_id");
};

export const getUsername = () => {
  return localStorage.getItem("username");
};

export const getCompanyId = () => {
  return localStorage.getItem("company_id");
};

export const getUserImage = () => {
  return localStorage.getItem("user_image");
};

export const getBaseStorage = () => {
  return "http://172.16.40.180:8080/storage/";
};
