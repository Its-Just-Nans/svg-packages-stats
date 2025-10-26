import makeSvg from "svg-packages-stats";

export default async (request, response) => {
    const author = request?.query?.author || "n4n5";
    const maintainer = request?.query?.maintainer || author;
    const period = request?.query?.period || "last-week";
    const svg = await makeSvg(author, maintainer, period);
    response.setHeader("Content-Type", "image/svg+xml");
    response.status(200).send(svg);
};
