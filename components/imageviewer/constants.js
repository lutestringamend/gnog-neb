export const pdfpagewidth = 640;
export const pdfpageheight = 800;
//612 792
//data:image/jpeg;base64,
export const multiplephotosimgtag = `
    <div align="center" style="width: #WIDTH# ; height: #HEIGHT# ; text-align: center; display: block; margin: auto">
        <img src="#URI#" style="width: 90vw;" />
    </div>
`;

export const multiplephotoshtml = `
<html>
  <head>
    <title>#TITLE#</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  </head>
  <body style="text-align: center;">
    #IMGTAGS#
  </body>
</html>
`;

export const filePrintOptions = {
  width: pdfpagewidth,
  height: pdfpageheight,
};

export const pdfmimetype = "application/pdf"

export const temporaryimgurl =
  "https://daclen.com/img/foto-watermark/1687854257FLYER PRODUCT 3_page-0005.jpg";
