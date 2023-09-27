import uploadImage  from "./uploadImage.js";
import fs from 'fs';

jest.mock("fs", () => ({
    writeFile: jest.fn(),
}));

afterEach(async () => {
    jest.clearAllMocks();
});
describe("UploadImage",()=>{
    it("Return success response and save file on localserver when valid",()=>{
        const data = "binarydata-010101-1010"
        const request = {
            file: {
                originalname: 'image.jpg',
                buffer: data,
            },
        };

        const result = uploadImage(request,{});

        expect(fs.writeFile).toHaveBeenCalledTimes(1);
        expect(result).toEqual({success: true, message: "yeah uploaded!"});
    })
    
    it('Return success false when no file', () => {          
        let result=uploadImage({},{});
        
        expect(result).toEqual({success: false, message: "Cannot read properties of undefined (reading 'buffer')"});
        });
    });
// })
