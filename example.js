// untuk kode uplod img ke api
   const buffer = await downloadMedia(m, "image");
      const filepath = `./image/bukti-${Date.now()}.jpg`;
      
      // Pastikan folder image ada
      if (!fs.existsSync('./image')) {
        fs.mkdirSync('./image', { recursive: true });
      }
      
      fs.writeFileSync(filepath, buffer);

      // Menggunakan FormData tanpa getLengthSync()
      const form = new FormData();
      form.append('image', fs.createReadStream(filepath), {
        filename: path.basename(filepath),
        contentType: 'image/jpeg'
      });
      form.append('apikey', 'gantidenganapikeymu');

      const response = await axios.post(
        'https://drenzocodex.web.id/api/upload-buktipembayaran',
        form,
        {
          headers: form.getHeaders(),
          // Tidak perlu Content-Length, axios akan otomatis mengatur
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        }
      );

      if (response.data.danzfyz.success) {
        const filename = response.data.danzfyz.data.filename;
        await m.reply(`✅ Bukti pembayaran berhasil diupload!\nFilename: ${filename}`);
      } else {
        await m.reply('❌ Gagal mengupload: ' + response.data.danzfyz.message);
      }

      // Hapus file lokal setelah sukses
      fs.unlinkSync(filepath);
      
    } catch (e) {
      console.error('Error:', e);
      let errorMessage = '❌ Gagal mengupload bukti pembayaran';
      
      if (e.response) {
        errorMessage += `\nServer error: ${e.response.data?.danzfyz?.message || e.response.statusText}`;
      } else {
        errorMessage += `\n${e.message}`;
      }
