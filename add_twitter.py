import re
text = open('index.html', 'r', encoding='utf-8').read()
twitter_html = '''
      <a href="https://x.com/14_anish_10" target="_blank" rel="noopener" class="connect-card" id="connect-twitter" aria-label="Follow on X / Twitter">
        <div class="connect-icon twitter-icon">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </div>
        <div class="connect-info">
          <h3>X / Twitter</h3>
          <p>Thoughts, tech &amp; updates</p>
        </div>
        <div class="connect-arrow">↗</div>
      </a>
    </div>
  </section>'''
new_text = re.sub(r'    </div>\s*</section>', twitter_html, text)
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_text)
print('Twitter added!')
