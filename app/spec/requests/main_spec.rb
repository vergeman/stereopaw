#
# Testing JS
#

describe 'some stuff which requires js', :js => true do
  before { visit root_path() }

  it 'will use the default js driver' do
    page.should_not have_css("div.main")
  end

  it "will have a test div" do
    page.should have_css("div.test")
  end

  it "will display TEST" do
    page.should have_content("TEST")
  end


end
